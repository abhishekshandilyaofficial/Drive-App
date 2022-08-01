(function(){
    let btnAddFolder = document.querySelector("#addFolder");    //Inside header div-Add folder button has id addFolder
    let btnAddTextFile = document.querySelector("#addTextFile");//Inside header div-Add Textfile button has id addTextFile
    let divbreadcrumb  = document.querySelector("#breadcrumb"); //div breadcrum has id breadcrumb
    let aRootPath = divbreadcrumb.querySelector("a[purpose='path']");
    let divContainer = document.querySelector("#container");    //Div container has id container
    let templates = document.querySelector("#templates");       //Templates tag has id templates

    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");
    let appClose = document.querySelector("#app-close");

    btnAddFolder.addEventListener("click", addFolder);          //When you click on button-(Add Folder)-addFolder method will get invoked
    btnAddTextFile.addEventListener("click", addTextFile);      //When you click on button-(Add TextFile)-addTextFile method will get invoked
    aRootPath.addEventListener("click", viewFolderFromPath);
    appClose.addEventListener("click", closeApp);
    let resources = [];
    let cfid = -1;
    let rid = 0;
    function closeApp(){
        divAppTitle.innerHTML = "title will come here";
        divAppTitle.setAttribute("rid", "");
        divAppMenuBar.innerHTML = "";
        divAppBody.innerHTML = "";
    }
    function addFolder(){
        let rname = prompt("Enter folder's name");
        rname = rname.trim();
        if(!rname){                                             //Empty case validation
            alert("Please Enter a name");
            return;
        }
        
        let exsists = resources.some(r => r.rname == rname && r.pid == cfid);
        if(exsists){
            alert("Folder with name "+rname+" already exsists, please enter a new name");
            return;
        }
        
        let pid = cfid;
        rid++;
        addFolderHTML(rname, rid, pid);
        resources.push({
            rid:rid,
            rname:rname,
            rtype: "folder",
            pid: cfid
        });
        saveToStorage();
    }
    function addTextFile(){
        let rname = prompt("Enter folder's name");
        rname = rname.trim();
        if(!rname){                                             //Empty case validation
            alert("Please Enter a name");
            return;
        }
        
        let exsists = resources.some(r => r.rname == rname && r.pid == cfid);
        if(exsists){
            alert("Folder with name "+rname+" already exsists, please enter a new name");
            return;
        }
        
        let pid = cfid;
        rid++;
        addTextFileHTML(rname, rid, pid);
        resources.push({
            rid:rid,
            rname:rname,
            rtype: "text-file",
            pid: cfid,
            isBold: true,
            isItalic: false,
            isUnderline: false,
            textColor: "#000000",
            bgColor: "#FFFFFF",
            fontFamily: "cursive",
            fontSize: 22,
            content: "I am a new file."
        });
        saveToStorage();
    }
    function addFolderHTML(rname, rid, pid){    
        let divFolderTemplate = templates.content.querySelector(".folder"); //Template ke andar ek content hai(Div) jiska id folder hai-use lao
        let divFolder = document.importNode(divFolderTemplate, true);       //Is content ka clone banao aur divfolder variable me dalo 

        let spanRename = divFolder.querySelector("[action=rename]");//issi divfoldermekaispanhai- jiskeattribute(action)kivalue[rename]haivospanlekeaao
        let spanDelete = divFolder.querySelector("[action=delete]");//issi divfoldermekaispanhai- jiskeattribute(action)kivalue[delete]haivospanlekeaao
        let spanView = divFolder.querySelector("[action=view]");    //issi divfoldermekaispanhai- jiskeattribute(action)kivalue[view]haivospanlekeaao
        let divName = divFolder.querySelector("[purpose=name]");    //issi divfoldermekai div hai- jiskeattribute(purpose)kivalue[name]haivospanlekeaao
                                                                    //saare span aur div milne ke baad unpe click ke liye event jodo
        spanRename.addEventListener("click", renameFolder);         //Rename span pe click ho to renamefolder ko call karo
        spanDelete.addEventListener("click", deleteFolder);         //Delete span pe click ho to deletefolder ko call karo
        spanView.addEventListener("click", viewFolder);             //viewFolder span pe click ho to viewfolder ko call karo
        divName.innerHTML = rname;                                  //divname vaale div ka innerHTML fname set karo jo prompt se diye ho
        divFolder.setAttribute("rid", rid);                         //divfolder ka rid attribute set karo rid se-jo ki add ho rhe resource ki id hai
        divFolder.setAttribute("pid", pid);                         //divfolder ka pid attribute set karo pid se-jo ki add ho rhe resource ke parent ki id hai
        divContainer.appendChild(divFolder); //Ye saare kaam divFolder ke andar kiye gae, ab isse webpage pe display karo through append child
    }
    function addTextFileHTML(rname, rid, pid){
        let divTextFileTemplate = templates.content.querySelector(".text-file"); //Template ke andar ek content hai(Div) jiska id folder hai-use lao
        let divTextFile = document.importNode(divTextFileTemplate, true);       //Is content ka clone banao aur divfolder variable me dalo 

        let spanRename = divTextFile.querySelector("[action=rename]");//issi divfoldermekaispanhai- jiskeattribute(action)kivalue[rename]haivospanlekeaao
        let spanDelete = divTextFile.querySelector("[action=delete]");//issi divfoldermekaispanhai- jiskeattribute(action)kivalue[delete]haivospanlekeaao
        let spanView = divTextFile.querySelector("[action=view]");    //issi divfoldermekaispanhai- jiskeattribute(action)kivalue[view]haivospanlekeaao
        let divName = divTextFile.querySelector("[purpose=name]");    //issi divfoldermekai div hai- jiskeattribute(purpose)kivalue[name]haivospanlekeaao
                                                                    //saare span aur div milne ke baad unpe click ke liye event jodo
        spanRename.addEventListener("click", renameTextFile);         //Rename span pe click ho to renamefolder ko call karo
        spanDelete.addEventListener("click", deleteTextFile);         //Delete span pe click ho to deletefolder ko call karo
        spanView.addEventListener("click", viewTextFile);             //viewFolder span pe click ho to viewfolder ko call karo
        divName.innerHTML = rname;                                  //divname vaale div ka innerHTML fname set karo jo prompt se diye ho
        divTextFile.setAttribute("rid", rid);                         //divfolder ka rid attribute set karo rid se-jo ki add ho rhe resource ki id hai
        divTextFile.setAttribute("pid", pid);                         //divfolder ka pid attribute set karo pid se-jo ki add ho rhe resource ke parent ki id hai
        divContainer.appendChild(divTextFile);
    }
    function saveToStorage(){
        let rjson = JSON.stringify(resources); //used to convert jso to json string which can be saved
        localStorage.setItem("data", rjson);
    }
    function loadFromStorage(){
        let rjson = localStorage.getItem("data");
        if(!rjson){
            return;
        }
        resources = JSON.parse(rjson);
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid)
                }else if(resources[i].rtype == "text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid)
                }
            }
            if(resources[i].rid > rid){
                rid = resources[i].rid;
            }
        }
        
    }
    loadFromStorage();
    function deleteFolder(){
        let spanDelete = this;
        let divFolder = spanDelete.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let fidTBD = parseInt(divFolder.getAttribute("rid"));
        let fname = divName.innerHTML;

        let childrenExists = resources.some(r => r.pid == fidTBD);
        let sure = false
        if(childrenExists == true){
            sure = confirm('Are you sure you want to delete '+fname+" and its childrens");
        }else{
            sure = confirm('Are you sure you want to delete '+fname);
        }
        
        if(!sure){
            return;
        }

        //html
        divContainer.removeChild(divFolder);
        //ram
        deleteHelper(fidTBD);
        //storage
        saveToStorage();
        
    }
    function deleteHelper(fidTBD){
        let children = resources.filter(r => r.pid == fidTBD);
        for(let i = 0; i < children.length; i++){
            deleteHelper(children[i].rid);
        }

        let ridx = resources.findIndex(r => r.rid == fidTBD);
        resources.splice(ridx,1);
    }
    
    function viewFolder(){
        let spanView = this;
        let divFolder = spanView.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));

        let aPathTemplate = templates.content.querySelector("a[purpose='path']");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = fname;
        aPath.setAttribute("rid", fid);
        aPath.addEventListener("click", viewFolderFromPath);
        divbreadcrumb.appendChild(aPath);

        cfid = fid;
        divContainer.innerHTML = "";
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid)
                }else if(resources[i].rtype == "text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid)
                }
            }
        }
    }
    function viewFolderFromPath(){
        let aPath = this;
        let fid = parseInt(aPath.getAttribute("rid"));

        // //set the breadcrumb
        while(aPath.nextSibling){
            aPath.parentNode.removeChild(aPath.nextSibling);
        }
        //Set the breadcrumb-another way
        // for(let i = divbreadcrumb.children.length-1; i >= 0; i--){
        //     if(divbreadcrumb.children[i] == aPath){
        //         break;
        //     }
        //     divbreadcrumb.removeChild(divbreadcrumb.children[i]);
        // }

        //set the container
        cfid = fid;
        divContainer.innerHTML = "";
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid)
                }else if(resources[i].rtype == "text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid)
                }
            }
        }
    }
    function deleteTextFile(){
        let spanDelete = this;
        let divTextFile = spanDelete.parentNode;
        let divName = divTextFile.querySelector("[purpose='name']");

        let fidTBD = parseInt(divTextFile.getAttribute("rid"));
        let fname = divName.innerHTML;

        let sure = confirm('Are you sure you want to delete '+fname);        
        if(!sure){
            return;
        }
        //html
        divContainer.removeChild(divTextFile);
        //ram
        let ridx = resources.findIndex(r => r.rid == fidTBD);
        resources.splice(ridx,1);
        //storage
        saveToStorage();

    }
    function renameFolder(){
       let nrname = prompt("Enter folder's name");
       if(nrname != null){
        nrname = nrname.trim();
       }
       if(!nrname){     //Empty name validation
        alert("Empty name is not allowed");
        return;
       }

       let spanRename = this;                                   //The divFolder on which rename span is clicked is this
       let divFolder = spanRename.parentNode;                   //We will get the divFolder by going to the parent node of divFolder
       let divName = divFolder.querySelector("[purpose=name]"); //we will extract divname from the divFolder by providing its attribute
       let orname = divName.innerHTML;                          //Give the name to old resource name
       let ridTBU = parseInt(divFolder.getAttribute("rid"));     //Resource id to be updated is extracted from rid attribute of the folder
       if(nrname == orname){
            alert("Please enter a new name");
            return;
       }
       
       let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname + " already exists.");
            return;
        }

        // change html
        divName.innerHTML = nrname;
        // change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;
        // change storage
        saveToStorage();

    }
    function renameTextFile(){
        let nrname = prompt("Enter file's name");
       if(nrname != null){
        nrname = nrname.trim();
       }
       if(!nrname){     //Empty name validation
        alert("Empty name is not allowed");
        return;
       }

       let spanRename = this;                                   //The divFolder on which rename span is clicked is this
       let divTextFile = spanRename.parentNode;                   //We will get the divFolder by going to the parent node of divFolder
       let divName = divTextFile.querySelector("[purpose=name]"); //we will extract divname from the divFolder by providing its attribute
       let orname = divName.innerHTML;                          //Give the name to old resource name
       let ridTBU = parseInt(divTextFile.getAttribute("rid"));     //Resource id to be updated is extracted from rid attribute of the folder
       if(nrname == orname){
            alert("Please enter a new name");
            return;
       }
       
       let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname + " already exists.");
            return;
        }

        // change html
        divName.innerHTML = nrname;
        // change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;
        // change storage
        saveToStorage();

    }
    function viewTextFile(){
        let spanView = this;
        let divTextFile = spanView.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        let divNotepadMenuTemplate = templates.content.querySelector("[purpose=notepad-menu]");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate = templates.content.querySelector("[purpose=notepad-body]");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let spanDownload = divAppMenuBar.querySelector("[action=download]");
        let inputUpload = divAppMenuBar.querySelector("[action=upload]");
        let spanForUpload = divAppMenuBar.querySelector("[action=forupload]");
        let textArea = divAppBody.querySelector("textArea");

        spanSave.addEventListener("click", saveNotepad);
        spanBold.addEventListener("click", makeNotepadBold);
        spanItalic.addEventListener("click", makeNotepadItalic);
        spanUnderline.addEventListener("click", makeNotepadUnderline);
        inputBGColor.addEventListener("change", changeNotepadBGColor);
        inputTextColor.addEventListener("change", changeNotepadTextColor);
        selectFontFamily.addEventListener("change", changeNotepadFontFamily);
        selectFontSize.addEventListener("change", changeNotepadFontSize);
        spanDownload.addEventListener("click", downloadNotepad);
        inputUpload.addEventListener("change", uploadNotepad);
        spanForUpload.addEventListener("click", function(){
            inputUpload.click();
        })

        let resource = resources.find(r => r.rid == fid);
        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        inputTextColor.value = resource.textColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.value = resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));
    }
    function downloadNotepad(){
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);
        let divNotepadMenu = this.parentNode;
        
        let strForDownload = JSON.stringify(resource);
        let encodedData = encodeURIComponent(strForDownload);
        
        let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
        aDownload.setAttribute("href", "data:text/json; charset=utf-8, " + encodedData);
        aDownload.setAttribute("download", resource.rname + ".json");

        aDownload.click();
    }
    function uploadNotepad(){
        let file = window.event.target.files[0]; 
        let reader = new FileReader();
        reader.addEventListener("load", function(){
            let data = window.event.target.result;
            let resource = JSON.parse(data);

            let spanBold = divAppMenuBar.querySelector("[action=bold]");
            let spanItalic = divAppMenuBar.querySelector("[action=italic]");
            let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
            let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
            let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
            let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
            let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
            let textArea = divAppBody.querySelector("textArea");

            spanBold.setAttribute("pressed", !resource.isBold);
            spanItalic.setAttribute("pressed", !resource.isItalic);
            spanUnderline.setAttribute("pressed", !resource.isUnderline);
            inputBGColor.value = resource.bgColor;
            inputTextColor.value = resource.textColor;
            selectFontFamily.value = resource.fontFamily;
            selectFontSize.value = resource.fontSize;
            textArea.value = resource.content;

            spanBold.dispatchEvent(new Event("click"));
            spanItalic.dispatchEvent(new Event("click"));
            spanUnderline.dispatchEvent(new Event("click"));
            inputBGColor.dispatchEvent(new Event("change"));
            inputTextColor.dispatchEvent(new Event("change"));
            selectFontFamily.dispatchEvent(new Event("change"));
            selectFontSize.dispatchEvent(new Event("change"));
        })
        reader.readAsText(file);    
    }
    function saveNotepad(){ 
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);

        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");

        resource.isBold = spanBold.getAttribute("pressed") == "true";
        resource.isItalic = spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
        resource.bgColor = inputBGColor.value;
        resource.textColor = inputTextColor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.content = textArea.value;

        saveToStorage();
    }
    function makeNotepadBold(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontWeight = "bold";
        }else{
            this.setAttribute("pressed", false);
            textArea.style.fontWeight = "normal";
        }
    }
    function makeNotepadItalic(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontStyle = "italic";
        }else{
            this.setAttribute("pressed", false);
            textArea.style.fontStyle = "normal";
        }
    }
    function makeNotepadUnderline(){
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.textDecoration = "underline";
        }else{
            this.setAttribute("pressed", false);
            textArea.style.textDecoration = "none";
        }
    }
    function changeNotepadBGColor(){
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.backgroundColor = color;
    }
    function changeNotepadTextColor(){
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.color = color;
    }
    function changeNotepadFontFamily(){
        let fontFamily = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontFamily = fontFamily;
    }
    function changeNotepadFontSize(){
        let fontSize = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontSize = fontSize;
    }
})();