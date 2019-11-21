module.exports = (function(){
	const fs = require('fs');
	const path = require('path');
	return function(params){
		var self = this;
		var filePath = params.path;
		filePath = path.join(path.join(__dirname,'/files/'), filePath);
		if(!filePath)throw new Error('path parameter was not supplied');
		var printToConsole = params.printToConsole;
		var writer = new Writer(filePath, printToConsole);
		this.error = function(msg){
			writer.write('ERROR: ',msg);
		};
		this.warn= function(msg){
			writer.write('WARN: ',msg);
		};
		this.info = function(msg){
			writer.write('INFO: ',msg);
		};
		function Writer(filePath, printToConsole){ 
			createDirectory(filePath);
			this.write = function(prefix, msg){
				
				console.log(typeof(msg));
				fs.writeFile(
					filePath, 
					'['+getDateString()+'] '+prefix+(typeof(msg)==='object'?JSON.stringify(msg):String(msg))+'\r\n', 
					{'flag':'a'}, 
					function(err) { if (err) { return console.error(err); } }
				);
			};	
			if(printToConsole){
				this.write = (function(write){
					return function(prefix, msg){
						write(prefix, msg);
						console.log(msg);
					};
				})(this.write);
			}
			function getDateString(){
				return new Date().toISOString();
			}
		}
		function createDirectory(filePath){
			var directory = path.dirname(filePath);
			try{
			fs.mkdirSync(directory, { recursive: true });
			}catch(Ex){
				
			}
		}
	}
})();

 