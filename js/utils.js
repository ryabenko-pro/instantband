function extend(Child, Parent) {
	var F = function() { }
	F.prototype = Parent.prototype
	Child.prototype = new F()
	Child.prototype.constructor = Child
	Child.superclass = Parent.prototype
}

function createEl(name, attr) {
    var el = document.createElement(name);
    
    if (attr)
        for (a in attr) 
            el[a] = attr[a];
    
    return el;
}
