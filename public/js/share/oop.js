/**
 * Created by hqyone on 8/18/16.
 */
/**
 * This function is copied from http://phrogz.net/js/classes/OOPinJS2.html
 * Usage:
 * Function Mammal(name){
     this.name = name;
     this.offspring =[];
   }
   Mammal.prototype.haveABaby=function(){
	var newBaby = new this.constructor( "Baby " + this.name );
	this.offspring.push(newBaby);
	return newBaby;
    }

  function Cat( name ){
	this.name=name;
  }
  Cat.inheritsFrom( Mammal );
  Cat.prototype.haveABaby=function(){
	var theKitten = this.parent.haveABaby.call(this);
	alert("mew!");
	return theKitten;
 }
 * @param {string} parentClassOrObject - parent object to be inherited
 * @returns {Function}
 */
Function.prototype.inheritsFrom = function( parentClassOrObject ){
    if ( parentClassOrObject.constructor == Function )
    {
        //Normal Inheritance
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    }
    else
    {
        //Pure Virtual Inheritance
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    }
    return this;
}