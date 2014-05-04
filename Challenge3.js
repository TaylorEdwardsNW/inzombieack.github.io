(function() {

//Models, collections, and users for the User
window.App = {

	Models: {},

	Collections: {},

	Views: {}

};

//Creates a template for the window
window.template = function(id) {
	return _.template( $('#' + id).html() );
};


//Creates a model for a single person with Backbone
App.Models.Person = Backbone.Model.extend({
	
	defaults: {
		
		name: 'Joe',
		
		last: 'Schmoe',
		
		email: 'test@gmail.com'
	
	}

});

//Creates a list of every single person created
App.Collections.People = Backbone.Collection.extend({
	
	model: App.Models.Person

});


//View for every instance of a person
App.Views.People = Backbone.View.extend({
	
	//html line tag
	tagName: 'p',

	//initializes to add
	initialize: function() {
		
		this.collection.on('add', this.add, this);
	
	},

	//render the add
	render: function() {
		
		this.collection.each(this.add, this);

		return this;
	
	},

	//the add function that is called
	add: function(person) {
		
		var personView = new App.Views.Person({ model: person });
		
		this.$el.append(personView.render().el);
	
	}

});

//Creates a view for an instance of a person with backbone
App.Views.Person = Backbone.View.extend({
	
	//html tag
	tagName: 'li',

	//template used by the view
	template: template('personTemplate'),	

	//houses render and remove on listeners
	initialize: function(){

		this.model.on('change', this.render, this);
		
		this.model.on('destroy', this.remove, this);
	
	},

	//event listeners for the edit buttons and delete
	events: {

	 //listens for click of edit on first name
	 'click #editPerson' : 'editPerson',
     
     //listens for click of edit on last name
     'click #editLast' : 'editLast',
     
     //listens for click of edit on email
     'click #editEmail' : 'editEmail',
	 
	 //lisens for click of delete on person
	 'click .delete' : 'DestroyPerson'	
	
	},

	//edit person function that edits the first name upon edit button click
	editPerson: function(){

		//assigns the prompt input to new first
		var newName = prompt("Please enter the new name", this.model.get('name'));
		
		if (!newName) return;
		
		//sets name to new first
		this.model.set('name', newName);
	
	},
    
    //edit last name function that edits upon click
    editLast: function(){

    	//assigns the prompt input to newLast
        var newLast = prompt("Please enter the new last name", this.model.get('last'));
        
        if(!newLast) return;
        
        //sets last to new last
        this.model.set('last', newLast);
    
    },
    
    //edit email function that edits upon click of email edit button
    editEmail: function(){
        
        //assigns the prompt input to new email
        var newEmail = prompt("Please enter the new email", this.model.get('email'));
        
        if(!newEmail) return;
        
        //sets email to new email
        this.model.set('email', newEmail);
    
    },

	//Destroys current person on click of delete
	DestroyPerson: function(){
		
		this.model.destroy();
	
	},

	//element remove
	remove: function(){
		
		this.$el.remove();
	
	},

	//render the view
	render: function() {
		
		this.$el.html( this.template(this.model.toJSON()) );
		
		return this;
	
	}
});

//adds a new person with backbone
App.Views.AddPerson = Backbone.View.extend({
	
	//element tag
	el: '#addPerson',

	//event listener for click of submit button
	events: {
		
		'submit': 'submit'
	
	},

	//submit function that is called on click
	submit: function(e) {

		e.preventDefault();

		//gets the new first name from html input field
		var newPersonName = $(e.currentTarget).find('input[class=first]').val();

		//gets new lastname from html input field
        var newPersonLast = $(e.currentTarget).find('input[class=last]').val();

        //gets new email from html input field
        var newPersonEmail = $(e.currentTarget).find('input[class=email]').val();

        //assigns the new values to the new person model
        var person = new App.Models.Person({ name: newPersonName, last: newPersonLast, email: newPersonEmail });
		
        //adds this new person to the list of people to be displayed
		this.collection.add(person);

	}
});

//sets the var to the Collection of people models
var peopleCollection = new App.Collections.People([
]);

//sets the person view to the model View
var addPersonView = new App.Views.AddPerson({ collection: peopleCollection });

//view to be rendered of the collection of models
peopleView = new App.Views.People({ collection: peopleCollection });

//appent to html
$(document.body).append(peopleView.render().el);
})();