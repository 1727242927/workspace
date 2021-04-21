const getters = {
  userInfo: state => state.user.userInfo,
  currentExhibition: state => state.user.currentExhibition,
  selfExhibition: state => state.user.currentExhibition.oe === 1, // 是否为自办展 1.是 0.否
  tagsList: state => state.tagsView.tagsList,
  permissionRoutes: state => state.permission.routes
}

export default getters