import map from './map406.json'

function findTargetEgg(world) {
  return world.eggs.find(egg => egg.id === 164)
}

function calculateSum(world) {
  return world.eggs.reduce((sum, egg) => sum + egg.value, 0)
}

const winCondition = {
  beforeStart() {
    this.sum = calculateSum(this.world)
    this.targetEgg = findTargetEgg(this.world)
  },

  check() {
    return (
      this.targetEgg.value === this.sum &&
      !this.targetEgg.owner &&
      this.targetEgg.x === 2 && this.targetEgg.y === 2
    )
  }
}

const wrongSumOnEggCondition = {
  beforeStart() {
    this.sum = calculateSum(this.world)
    this.targetEgg = findTargetEgg(this.world)
  },

  check() {
    return this.targetEgg.value !== 0 && this.targetEgg.value !== this.sum
  },

  getReason() {
    return 'loss_reason_wrong_sum_on_egg'
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Feedback",
    fr: "Remontée d'information",
  },
  objective: {
    en: "Write the sum of all %%icon icon-egg$%% eggs on the top egg. At the end, the top %%icon icon-egg$%% egg must be in the same place as at the beginning.\n\n%%icon mdi mdi mdi-alert-octagon-outline$%% Do not write anything other than the sum of the eggs on the top %%icon icon-egg$%% egg. You can write whatever you want on the other %%icon icon-egg$%% eggs.",
    fr: "Écris la somme de tous les %%icon icon-egg$%% œufs sur l'œuf du haut. À la fin, l'%%icon icon-egg$%% œuf du haut doit être à la même place qu'au début.\n\n%%icon mdi mdi-alert-octagon-outline$%% Tu ne dois pas écrire autre chose que la somme des œufs sur l'%%icon icon-egg$%% œuf du haut. Tu peux écrire ce que tu veux sur les autres %%icon icon-egg$%% œufs.",
  },

  messages: {
    loss_reason_wrong_sum_on_egg: {
      en: "A hero wrote something else than the sum of the eggs on the top egg",
      fr: "Un héro a écrit quelque chose d'autre que la somme des œufs sur l'œuf du haut"
    },
  },

  maxStep: 200,
  speedTarget: 26,
  lengthTarget: 8,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: false,
    terrainTypes: ['floor', 'wall', 'hole'],
    objectTypes: ['hero', 'egg', 'nothing'],
    actionFunctions: ['take', 'drop', 'write'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'myitem', 'integer', 'variable']
  },

  ruleset: {
    win: [winCondition],
    lose: [wrongSumOnEggCondition, 'or', 'default_loss']
  },
}

export default level