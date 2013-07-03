Application.Model.Entity = Application.Model.BaseObject.extend({
	$isVisible: true,
    $isSelected: false,
    $isActive: false,
    $isBusy: false,

    $toggleSelected: function () {
        var self = this;
        self.$isSelected = !self.$isSelected;
    },
	
	shout: function(){
        console.log('from entity: ' + this.message);
    }
});