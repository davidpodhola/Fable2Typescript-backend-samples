import { find } from "./out/lib"

class Greeter {
    constructor(public greeting: string) { }
    greet() {
        let a = [ 1, 2, 3, 4 ];
        let res = find( a );
        console.log(res);
        return "<h1>" + this.greeting + " " + res + "</h1>";
    }
};

var greeter = new Greeter("Hello, world!");
    
document.body.innerHTML = greeter.greet();