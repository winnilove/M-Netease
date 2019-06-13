const router = {
    renderView(){
        let state = history.state || '/position'
        switch(state.path){
            case '/position' : 
                $('main').html('position')
                break;
            case '/search' : 
                $('main').html('search')
                break;
            case '/profile':
                $('main').html('profile')
                break;
        }
    },
    init(){
        let that = this
        $('nav a').on('click',function(event){
            event.preventDefault()
            let path = $(this).attr('href')
            history.pushState({path},null,path)
            this.renderView()
        })
        window.addEventListener('popstate',this.renderView)
        window.addEventListener('load',this.renderView)
    }
}
export{
    router
}