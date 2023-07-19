import Taro from '@tarojs/taro'
export function useParent(name, onEffect) {
  const path = `../${name}/index`
  return {
    relations: {
      [path]: {
        type: 'ancestor',
        linked() {
          onEffect && onEffect.call(this)
        },
        linkChanged() {
          onEffect && onEffect.call(this)
        },
        unlinked() {
          onEffect && onEffect.call(this)
        },
      },
    },
    mixin: Taro.Behavior({
      created() {
        Object.defineProperty(this, 'parent', {
          get: () => {
            const relationNodes = this.getRelationNodes(path)
            return relationNodes ? relationNodes[0] : undefined
          },
        })
        Object.defineProperty(this, 'index', {
          // @ts-ignore
          get: () => {
            var _a, _b
            return (_b =
              (_a = this.parent) === null || _a === undefined
                ? undefined
                : _a.children) === null || _b === undefined
              ? undefined
              : _b.indexOf(this)
          },
        })
      },
    }),
  }
}
export function useChildren(name, onEffect) {
  const path = `../${name}/index`
  return {
    relations: {
      [path]: {
        type: 'descendant',
        linked(target) {
          onEffect && onEffect.call(this, target)
        },
        linkChanged(target) {
          onEffect && onEffect.call(this, target)
        },
        unlinked(target) {
          onEffect && onEffect.call(this, target)
        },
      },
    },
    mixin: Taro.Behavior({
      created() {
        Object.defineProperty(this, 'children', {
          get: () => this.getRelationNodes(path) || [],
        })
      },
    }),
  }
}
