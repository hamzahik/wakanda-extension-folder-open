var actions	= {};

actions.openFolder = function(){
	var folder = studio.folderSelectDialog();
	
	if(!folder){
		return;
	}
	
	var solutionFile = getSolutionFile(folder);
	
	if(!solutionFile){
		solutionFile = createSolution(folder);
		
		if(!solutionFile){
			studio.alert("Couldn't create temporary files in the destination folder");
			
			return;
		}
	}
	
	var projectFile = getProjectFile(folder);
	
	if(!projectFile){
		projectFile = createProject(folder);
		
		if(!projectFile){
			studio.alert("Couldn't create temporary files in the destination folder");
			
			return;
		}
	}
	
	var isOK         = studio.openSolution(solutionFile.path);
	
	if(!isOK){
		studio.alert("Couldn't open the folder");
	}
	
	return true;
};

function createProject(folder){
	var projectFile   = File(folder, "project.waProject");
	
	saveText('<?xml version="1.0" encoding="UTF-8"?><project><folder path="./"><tag name="webFolder"/></folder></project>', projectFile);
	
	return projectFile;
}

function createSolution(folder){
	var solutionFolder = Folder(folder, ".wakanda");
	var solutionFile   = File(solutionFolder, "solution.waSolution");
	
	solutionFolder.create();
	
	saveText('<?xml version="1.0" encoding="UTF-8"?><solution><project path="../project.waProject"/></solution>', solutionFile);
	
	return solutionFile;
}

function getProjectFile(folder){
	var possibleProjectFile = File(folder, "./project.waProject");
	
	if(possibleProjectFile.exists){
		return possibleProjectFile;
	}
	
	return null;
}


function getSolutionFile(folder){
	var possibleSolutionFile = File(folder, "./.wakanda/solution.waSolution");
	
	if(possibleSolutionFile.exists){
		return possibleSolutionFile;
	}
	
	return null;
}

exports.handleMessage = function handleMessage(message) {
	var action	= message.action;
	
	if(typeof actions[action] === "function"){
		/*
		 * Call the corresponding function
		 */ 
		actions[action](message);
	} else {
		/*
		 * Unknown action
		 */ 
		return false;
	}
};