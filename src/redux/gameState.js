import yana from '../logic/yahtzeeAnalysis.js'

/*
 * First, set up the actions changing things.
 */

const actions = {
  clickDice: (index) => ({
    type: 'ClickDice',
    index,
  }),
  pressNumber: (number) => ({
    type: 'PressNumber',
    number,
  }),
  clickField: (index) => ({
    type: 'ClickField',
    index,
  }),
  rollDice: () => ({
    type: 'RollDice',
  }),
  resetGame: () => ({
    type: 'ResetGame',
  }),
}
export default actions

/*
 * Second, set up the reducer applying the actions to the state.
 */

export function reducer(gs = newGameState(), action) {
  switch (action.type) {

    case 'ClickDice': {
      if (!canClickOnDice(gs))
        throw new Error('Cannot select/deselect dice at this moment.')

      // Change selection of the given dice.
      const selectedDice = gs.selectedDice.slice(0)
      selectedDice[action.index] = !selectedDice[action.index]
      return {
        ...gs,
        selectedDice
      }
    }

    case 'PressNumber': {
      if (!canClickOnDice(gs))
        throw new Error('Cannot select/deselect dice at this moment.')

      // Check if a dice with the given number is present.
      const isDiceWithNumberPresent = gs.dice.reduce((res,v) => res || v === action.number, false)
      if (!isDiceWithNumberPresent)
        return gs // No dice with the given number. Do nothing.

      // Check if a dice with the given number is unselected.
      const selectedDice = gs.selectedDice.slice(0)
      const isDiceWithNumberUnselected = gs.dice.reduce((res,v,i) => res || (v === action.number && !gs.selectedDice[i]), false)
      if (isDiceWithNumberUnselected) {
        // Select the dice (with the right number and unselected) with the lowest position/order.
        let best, bestPos
        gs.dice.forEach((v,i) => {
          if (v !== action.number || selectedDice[i])
            return
          if (best !== undefined && gs.diceOrder[i] >= bestPos)
            return
          bestPos = gs.diceOrder[i]
          best = i
        })
        selectedDice[best] = true
      } else {
        // Unselect all dice with the given number.
        gs.dice.forEach((v,i) => {
          if (v === action.number)
            selectedDice[i] = false
        })
      }

      // Apply the selection we made.
      return {
        ...gs,
        selectedDice
      }
    }

    case 'ClickField': {
      if (!canClickOnField(gs, action.index))
        throw new Error('Cannot select/deselect field "' + action.index + '" at this moment.')

      // Update the state.
      gs = {
        ...gs,
        selectedField: (isFieldSelected(gs, action.index) ? -1 : action.index)
      }

      // If this was the last field, finish the game.
      if (getNumRemainingFields(gs) === 0) {
        gs = applyFieldSelection(gs)
        // TODO: SAVE THE GAME TO FIREBASE.
      }
      return gs
    }

    case 'RollDice': {
      if (!canRollDice(gs))
        throw new Error('Cannot roll dice at this moment.')

      // If a field was selected, finalize this.
      if (isAFieldSelected(gs))
        gs = applyFieldSelection(gs)

      // Set up rerolls. Apply them according to the order that the dice already have.
      const numUnselectedDice = getNumUnselectedDice(gs)
      let newDice = new Array(numUnselectedDice).fill(0).map(() => Math.ceil(Math.random() * (yana.numSides))).sort()
      newDice = gs.dice.map((v, ind) => gs.selectedDice[ind] ? v : newDice[getDicePositionInCategory(gs, ind)])

      // Update the order. This may have changed when the selected dice are all high, while the new rolls are low, or vice versa.
      const newOrder = newDice.map((v, ind) => {
        return newDice.reduce((sum, v2, ind2) => {
          if (v > v2 || (v === v2 && gs.diceOrder[ind] > gs.diceOrder[ind2]))
            return ++sum
          return sum
        }, 0)
      })

      // Set up the new state, including other settings.
      return {
        ...gs,
        dice: newDice,
        diceOrder: newOrder,
        rollsLeft: gs.rollsLeft - 1,
        lastRollAt: new Date()
      }
    }

    case 'ResetGame': {
      if (!canResetGame(gs))
        throw new Error('Cannot reset the game at this moment.')

      return newGameState()
    }

    default: {
      return gs
    }
  }
}

function newGameState() {
  return {
    scores: new Array(yana.numFields).fill(-1),
    dice: new Array(yana.numDice).fill(-1),
    diceOrder: new Array(yana.numDice).fill(0).map((v, ind) => ind),
    selectedDice: new Array(yana.numDice).fill(false),
    rollsLeft: yana.numRolls,
    lastRollAt: new Date(),
    selectedField: -1,
  }
}

function applyFieldSelection(gs) {
  // If no field is selected, something is wrong.
  if (gs.selectedField < 0)
    throw new Error('Cannot apply the field selection when no field is selected.')

  // Calculate the value of the selected field.
  const sortedDice = gs.dice.slice(0).sort().reverse()
  let scores = gs.scores.slice(0)
  scores[gs.selectedField] = yana.fieldScore(gs.selectedField, sortedDice)

  // Update and return the state.
  return {
    ...gs,
    scores: scores,
    dice: new Array(yana.numDice).fill(-1),
    selectedDice: new Array(yana.numDice).fill(false),
    rollsLeft: yana.numRolls,
    selectedField: -1,
  }
}

/*
 * Third, set up getter functions for various useful parameters.
 */

export function isAFieldSelected(gs) {
  return gs.selectedField >= 0
}

export function isFieldSelected(gs, fieldIndex) {
  return gs.selectedField === fieldIndex
}

export function getNumRemainingFields(gs) {
  const remainingFields = gs.scores.reduce((sum, v) => v < 0 ? ++sum : sum, 0)
  return isAFieldSelected(gs) ? remainingFields - 1 : remainingFields
}

export function isGameFinished(gs) {
  return getNumRemainingFields(gs) === 0
}

export function getNumSelectedDice(gs) {
  return gs.selectedDice.reduce((sum, v, ind) => isDiceSelected(gs, ind) ? ++sum : sum, 0)
}

export function getNumUnselectedDice(gs) {
  return yana.numDice - getNumSelectedDice(gs)
}

// getDicePositionInCategory returns the position that the dice should have in its category (selected or not selected). If it's the third unselected dice, this will return position 2. (The first has position 0.)
export function getDicePositionInCategory(gs, diceIndex) {
  const isSelected = isDiceSelected(gs, diceIndex)
  const order = gs.diceOrder[diceIndex]
  return gs.selectedDice.reduce((sum, v, ind) => isDiceSelected(gs, ind) === isSelected && gs.diceOrder[ind] < order ? ++sum : sum, 0)
}

export function isDiceSelected(gs, diceIndex) {
  if (gs.rollsLeft === yana.numRolls || isAFieldSelected(gs))
    return false
  return gs.selectedDice[diceIndex]
}

export function isFieldTaken(gs, fieldIndex) {
  if (gs.scores[fieldIndex] >= 0)
    return true
  return (isAFieldSelected(gs) && fieldIndex === gs.selectedField)
}

export function areAllNumberFieldsTaken(gs) {
  return gs.scores.reduce((res, v, ind) => res && (ind >= yana.numSides || isFieldTaken(gs, ind)), true)
}

export function showBonus(gs) {
  return getBonus(gs) > 0 || areAllNumberFieldsTaken(gs)
}

export function showFieldValue(gs, fieldIndex) {
  if (isFieldTaken(gs, fieldIndex))
    return true
  if (gs.rollsLeft === yana.numRolls)
    return false // No rolls have been done yet.
  if (isAFieldSelected(gs) && !isFieldSelected(gs, fieldIndex))
    return false // Another field has been selected.
  return getFieldDisplayValue(gs, fieldIndex) > 0
}

export function getFieldValue(gs, fieldIndex) {
  if (!isFieldTaken(gs, fieldIndex))
    return 0 // The field has not been taken yet.
  if (!isFieldSelected(gs, fieldIndex))
    return gs.scores[fieldIndex] // The field has been taken and finalized.

  // The field is selected, but this selection has not been finalized. Calculate the value that it will become.
  const sortedDice = gs.dice.slice(0).sort().reverse()
  return yana.fieldScore(fieldIndex, sortedDice)
}

// getFieldDisplayValue returns a value to display at the given field. It's not necessarily the value that has been selected for that field.
export function getFieldDisplayValue(gs, fieldIndex) {
  if (gs.scores[fieldIndex] >= 0)
    return gs.scores[fieldIndex] // The field is already taken.

  // Calculate what the field can potentially become.
  const sortedDice = gs.dice.slice(0).sort().reverse()
  return yana.fieldScore(fieldIndex, sortedDice)
}

export function getNumberFieldSum(gs) {
  return gs.scores.reduce((sum, v, ind) => sum + (ind < yana.numSides ? getFieldValue(gs, ind) : 0), 0)
}

export function getNonNumberFieldSum(gs) {
  return gs.scores.reduce((sum, v, ind) => sum + (ind >= yana.numSides ? getFieldValue(gs, ind) : 0), 0)
}

export function getBonus(gs) {
  return getNumberFieldSum(gs) >= yana.bonusThreshold ? yana.bonus : 0
}

export function getGameScore(gs) {
  return getNumberFieldSum(gs) + getBonus(gs) + getNonNumberFieldSum(gs)
}

export function canClickOnDice(gs) {
  return !isAFieldSelected(gs) && gs.rollsLeft < yana.numRolls
}

export function canClickOnField(gs, fieldIndex) {
  if (gs.rollsLeft === yana.numRolls)
    return false // Cannot click on a field when no roll has been done yet.
  if (isAFieldSelected(gs))
    return isFieldSelected(gs, fieldIndex) // We can only click on the field that is selected.
  else
    return !isFieldTaken(gs, fieldIndex)
}

export function canRollDice(gs) {
  if (!enableRollButton(gs))
    return false
  if ((new Date()).getTime() - gs.lastRollAt.getTime() < 500)
    return false // To prevent users from rolling twice when accidentally double-clicking, limit rolls to once per a given unit of time.
  return true
}

// enableRollButton determines whether the roll button looks enabled. This is different from whether it actually works. The reason is that sometimes it's ugly to indicate that the roll button doesn't work, while we don't want it to work.
export function enableRollButton(gs) {
  if (getNumSelectedDice(gs) === yana.numDice)
    return false
  if (gs.rollsLeft === 0 && !isAFieldSelected(gs))
    return false
  if (isGameFinished(gs))
    return false
  return true
}

export function canResetGame(gs) {
  return isGameFinished(gs)
}
