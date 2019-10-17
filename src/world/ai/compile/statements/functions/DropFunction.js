import FunctionExpression from './FunctionExpression'
import DirectionLiteral from '../literals/DirectionLiteral'
import VariableIdentifier from '../VariableIdentifier'
import WorldObjectFinder from '../../../WorldObjectFinder'
import Direction from '../../../../Direction'
import StepAction from '../../../../actions/StepAction'
import WaitAction from '../../../../actions/WaitAction'
import DropAction from '../../../../actions/DropAction'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class DropFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('DropFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: DirectionLiteral,
      }, {
        type: VariableIdentifier,
      }]
    ]
  }

  computeValue(context) {
    if (this.params[0] instanceof DirectionLiteral) {
      return this.dropToDirection(context)
    } else if (this.params[0] instanceof VariableIdentifier) {
      return this.dropToVariable(context)
    }
  }

  dropToDirection(context) {
    return {
      step: true,
      complete: true,
      goto: null,
      action: new DropAction(this.params[0].value)
    }
  }

  dropToVariable(context) {
    let complete = true
    let action = new WaitAction()

    let variable = this.params[0].computeValue(context)
    let objectValue = variable.getFirstObjectValue()

    if (!!objectValue && !!context.character.item) {
      let target = objectValue.value

      // If we arrived at destination we drop
      if (WorldObjectFinder.hasArrivedAroundObject(context.character, target)) {
        action = new DropAction(new Direction(target.x - context.character.x, target.y - context.character.y))
      } else { // Step toward destination
        complete = false
        let objectFinder = new WorldObjectFinder(target, context.character, context.world)
        let direction = objectFinder.findDirection()
        if (!direction.equals(Direction.here)) {
          action = new StepAction(direction)
        }
      }
    }

    return {
      step: true,
      complete: complete,
      goto: null,
      action: action,
    }
  }

  onInvalidNumberOfParams(config) {
    throw new InvalidNumberOfParamsException('\'drop\' function requires exactly 1 parameter', this, {
      template: 'exception_invalid_params_one_dir_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        directions: Direction.names
      }
    })
  }

  onInvalidParam(index, param, config) {
    throw new InvalidFunctionParamsException(`'${param.code.join(' ').trim()}' is not a valid direction literal`, param, {
      template: 'exception_invalid_direction_param_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        param: param.code.join(' ').trim(),
        allowedValues: Direction.names
      }
    })
  }
}

DropFunction.keyword = 'drop'