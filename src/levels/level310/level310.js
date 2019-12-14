import map from './map310.json'

const winCondition = {
  beforeStart() {
    this.targetValues = this.world.eggs
      .filter(egg => egg.y === 6)
      .sort((a, b) => a.x - b.x)
      .map(egg => egg.shallowCopy())
  },

  check() {
    return this.world.eggs
      .filter(egg => egg.y < 4)
      .sort((a, b) => a.x - b.x)
      .every((egg, index) => this.targetValues[index].value === egg.value)
  },
}

const level = {
  mapConfig: map,
  name: {
    en: "Telegram",
    fr: "Télégramme",
  },
  objective: {
    en: "Copy the bottom %%icon icon-egg$%% eggs on the top %%icon icon-egg$%% eggs.",
    fr: "Recopie les %%icon icon-egg$%% œufs du bas sur les %%icon icon-egg$%% œufs du haut.",
  },

  maxStep: 600,
  speedTarget: 143,
  lengthTarget: 16,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall', 'hole'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step_once', 'write', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 2,
    messages: 8,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['direction', 'terrain_type', 'object_type', 'integer'],
  },

  ruleset: {
    win: [winCondition],
    lose: ['default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 331,
      width: 8,
      height: 1,

      strategy: {
        type: 'simple',
        eggConfig: {
          value: 'rng(1,7)',
          lottery: 'rng(1,7)',
          showLottery: true
        }
      }
    }
  }]
}

export default level