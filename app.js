var app = new Vue({
    el: '#app',
    data: {
        contents : {
            "title" : "Loading"
        },
        debug: false
    },
    created:function(){
        var self=this;
        console.log("created");
        this.loadComponents(["app-contents","app-question","app-text","app-video"],function(){
            var view=document.location.hash.replace("#","").split("/")[0];
            if (view==""){
                view="example";
            }
            self.loadView(view);
        })
    },
    mounted:function(){
        console.log("mounted",this.contents);
    },
    methods: {
        loadComponents:function(list,callback, pos){
            var self = this;
            if (!pos){
                pos=0;
            }
            console.log("Loading",pos,list[pos]);
            if (!list[pos]){
                callback(pos);
                return;
            }
            this.loadComponent(list[pos],function(text){
                self.loadComponents(list, callback, pos+1);
            })
        },
        loadComponent:function(id, callback){
            fetch("components/"+id+".html?"+Math.random())
            .then(function(data){
                return data.text()
            })
            .then(function(text){
                console.log("component",id);
                callback(text);
                var e=document.createElement("div");
                e.id="component-"+id;
                e.innerHTML=text;
                document.body.appendChild(e);
                var script=e.querySelector("script[type='text/javascript']");
                eval(script.innerHTML);
            })
        },
        loadView:function(view){
            var self=this;
            console.log("Load view",view);
            fetch("data/"+view+".json?"+Math.random())
            .then(function(data){
                return data.json()
            })
            .then(function(json){
                console.log("json",json,self.contents);
                self.contents=json;
                document.title=json.title;
            })
        }
    }
})