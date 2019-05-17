import homePage from './home'
export default (store) => {
    return [
        { path: '/', component: homePage, public: true },
    ]
}
