<!-- 导航菜单 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement, VNodeData, RenderContext } from 'vue'
import ElMenu from 'element-ui/lib/menu'
import ElSubMenu from 'element-ui/lib/submenu'
import ElMenuItem from 'element-ui/lib/menu-item'
import Icon from '../Icon'

import CONFIG from '@/config'
import { Menu } from '@/functions/auth'
import { url } from '@/functions/validators'
import COLOR from '@/scss/export/color.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const SubMenu = (context: RenderContext) => {
  const props = context.props
  const menu: Menu = props.menu
  const index = props.index
  const click = props.click
  const menuClass = props.menuClass
  const children = menu.children?.filter(child => !child.hide)
  const nativeOn = {
    click: (e) => {
      e.stopPropagation()
      click.call(context.parent, menu)
    },
  }

  return children?.length ? (
    <ElSubMenu
      key={index}
      index={index}
      popperClass={menuClass}
      nativeOn={nativeOn}
    >
      <template slot="title">
        {menu.icon && <Icon icon={menu.icon} />}
        {menu.desc ? (
          <el-tooltip content={menu.desc}>
            <span>{menu.title}</span>
          </el-tooltip>
        ) : (
          <span>{menu.title}</span>
        )}
      </template>
      {children.map((subMenu, i) => (
        <SubMenu
          index={subMenu.id || index + '.' + i}
          menu={subMenu}
          click={click}
        />
      ))}
    </ElSubMenu>
  ) : (
    <ElMenuItem key={index} index={index} nativeOn={nativeOn}>
      {menu.icon && <Icon icon={menu.icon} />}
      <template slot="title">
        {menu.desc ? (
          <el-tooltip content={menu.desc}>
            <span>{menu.title}</span>
          </el-tooltip>
        ) : (
          <span>{menu.title}</span>
        )}
      </template>
    </ElMenuItem>
  )
}

/** emit: (事件名: [参数列表, ...])
 *    noPath: [menu:点击的菜单对象] 点击没有跳转地址的菜单
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    data: { type: Object, required: true },
    mode: { type: String, default: '' },
    /** 跳转SPA基础路径 falsy: CONFIG.home */
    home: { type: String, default: '' },
    activeTextColor: { type: String, default: COLOR.white },
    commonTxtColor: { type: String, default: COLOR.textCommon },
  },
  methods: {
    onClick(menu: Menu) {
      sessionStorage.clear()
      if (menu.path) {
        const router = this.$router
        if (menu.path === router.currentRoute.fullPath) {
          router.replace('/r' + menu.path)
        } else {
          try {
            url(menu.path)
            window.open(menu.path)
          } catch (error) {
            const home = this.home || CONFIG.home
            home === this._$SPA
              ? router.push(menu.path)
              : CONFIG.g(home, menu.path)
          }
        }
      } else {
        this.$emit('noPath', menu)
      }
    },
  },
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h: CreateElement) {
    const data = this.$data as VNodeData
    const DATA = this.data as Menu
    const activeTextColor = this.activeTextColor
    const commonTxtColor = this.commonTxtColor
    const menuClass = this.$style.menu

    return (
      <ElMenu
        ref={data.ref}
        key={data.key}
        uniqueOpened={true}
        mode={this.mode}
        defaultActive={this.$route?.meta.id}
        textColor={commonTxtColor}
        backgroundColor={COLOR.white}
        activeTextColor={activeTextColor}
        class={menuClass}
      >
        {DATA.children
          ?.filter(child => !child.hide)
          .map((menu, index) => (
            <SubMenu
              index={menu.id || '.' + index}
              menu={menu}
              click={this.onClick}
              menuClass={menuClass}
            />
          ))}
      </ElMenu>
    )
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/menu';
@import '~element-ui/packages/theme-chalk/src/submenu';
@import '~element-ui/packages/theme-chalk/src/menu-item';
</style>

<style lang="scss" module>
.menu :global {
  .el-menu-item,
  .el-submenu__title {
    // stylelint-disable-next-line selector-max-compound-selectors
    > i,
    > svg,
    > img {
      margin-right: $gapNormal / 4;
      color: inherit;
      vertical-align: middle;
    }
  }

  // stylelint-disable-next-line selector-max-compound-selectors
  // .el-submenu:hover,
  // .el-menu-item:hover {
  //   color: $colorTextMinor !important;
  // }

  // stylelint-disable-next-line selector-max-compound-selectors
  .el-submenu__title {
    background-color: $colorTransparent !important;

    // stylelint-disable-next-line selector-max-compound-selectors
    > .el-submenu__icon-arrow {
      width: $smaller !important;
      height: $smaller !important;
      margin-right: -5px;
      font-size: $smaller !important;
    }
  }

  // stylelint-disable-next-line selector-max-compound-selectors
  // .el-submenu:hover > .el-submenu__title {
  //   color: inherit !important;
  //   // color: $colorWhite !important;
  // }

  .el-menu--popup {
    padding: 10px 0;

    // stylelint-disable-next-line selector-max-compound-selectors
    .el-submenu__title {
      color: $colorTextCommon !important;
    }
    // stylelint-disable-next-line selector-max-compound-selectors
    .el-menu-item {
      padding-left: 10px;
      color: $colorTextCommon !important;
    }

    // stylelint-disable-next-line selector-max-compound-selectors
    .el-submenu,
    .el-menu-item {
      // stylelint-disable-next-line selector-max-compound-selectors
      &:hover {
        color: $colorTextCommon !important;
        background: $colorTheme9 !important;
      }
    }
  }
}
</style>
