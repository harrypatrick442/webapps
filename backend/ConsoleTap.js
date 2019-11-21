module.exports = new (function(){
	const Core = require('core');
	const EventEnabledBuilder = Core.EventEnabledBuilder;
	EventEnabledBuilder(this);
	var self = this;
	console.log = (function(log){return function(msg){
		log(msg);
		dispatchLog(msg);
	};})(console.log);
	console.error = (function(error){return function(msg){
		error(msg);
		dispatchError(msg);
	};})(console.error);
	function dispatchLog(msg){
		self.dispatchEvent({type:'log',msg:msg});
	}
	function dispatchError(msg){
		self.dispatchEvent({type:'error',msg:msg});
	}
})();