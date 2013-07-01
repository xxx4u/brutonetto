var Guid = {
    emptyGuid: '00000000-0000-0000-0000-000000000000',
    
    newGuid: function() {
        var uid = function(){
		  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        
        return (uid() + uid() + '-' + uid() + '-' + uid() + '-' + uid() + '-' + uid() + uid() + uid()).toUpperCase();
    }
}