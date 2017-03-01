import { add } from "./out/lib"

class Greeter {
    constructor(public greeting: string) { }
    greet() {
        let three = add(1,2);
        return "<h1>" + this.greeting + "</h1>";
    }
};

var greeter = new Greeter("Hello, world!");
    
document.body.innerHTML = greeter.greet();