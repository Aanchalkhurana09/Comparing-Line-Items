import { LightningElement,track,api,wire} from 'lwc';
import getProposalList from '@salesforce/apex/getProposals.getProposalList'
import getLineItems from '@salesforce/apex/getProposals.getLineItems'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// import getLineItemsToCsv from '@salesforce/apex/getProposals.getLineItemsToCsv'
// import {exportCSVFile} from 'c/utils'

 
const columns=[
    {label: 'Base Price', fieldName: 'BasePrice__c'},
    {label: 'Acceptance Date', fieldName: 'Acceptance_Date__c'},
    {label: 'Name', fieldName: 'Name'}
    

]

// columnHeader = ['Name','APTS_Acceptance_Date__c','Apttus_QPConfig__BasePrice__c' ]

const columns1 =[
    {label: 'Base Price', fieldName: 'BasePrice__c'},
    {label: 'Acceptance Date', fieldName: 'Acceptance_Date__c'},
    {label: 'Name', fieldName: 'Name'}

]


export default class CompareLineItems extends LightningElement {

    // value='';
   //  value1='';
   selectedValueLeft='';
   selectedValueRight='';
 
   lineItemsData=[]
    
    accOptions=[];
    cardVisible=false;
   columnsField=columns;
   columnsData=columns1;
   
    dataLeft=[];
    dataRight=[];
    
    @api recordId;
   

    

    get options(){
        return this.accOptions;
    }

    connectedCallback(){
        getProposalList({lwcRecordId: this.recordId})
        .then(result=>{          
            let arr=[];
            for(var i=0; i<result.length;i++){
                arr.push({label: result[i].Name, value:result[i].Id})
            }
            this.accOptions=arr;
        })
    }

    

UpdateLeftValues(event){
    this.selectedValueLeft=event.target.value;
}

UpdateRightValues(event){
    this.selectedValueRight=event.target.value;
}


    

    handleCompare(){
       if(this.selectedValueLeft===this.selectedValueRight){
        this.cardVisible=false;
        this.showToast();
      } 
       else{
        this.cardVisible=true;
       }

    

      if(this.selectedValueLeft==='' || this.selectedValueRight==='' ){
        this.cardVisible=false;
        this.showToast1();
       } 
       else{
        this.cardVisible=true;
       }

        this.loadLeftItems();
        this.loadRightItems();

       /* if(this.selectedValueRight===''){
          this.cardVisible=false;
          this.showToast2();
         } 
         else{
          this.cardVisible=true;
         }*/
      
  }

  loadLeftItems(){
    getLineItems({selectedProposal: this.selectedValueLeft})
    .then(response=>{
       // this.dataLeft=response;
       this.dataLeft=response;
    })
    .catch(error=>{
       // window.alert("Some error occured")
    })

  }

  loadRightItems(){
    getLineItems({selectedProposal: this.selectedValueRight})
    .then(response=>{
       // this.dataRight=response;
       this.dataRight=response;
        
        console.log("response"+JSON.parse(response.data))
    })
    .catch(error=>{
       // window.alert("Some error occured")
    })

  }

  showToast() {

    const evt1 = new ShowToastEvent({
        
      title: 'ERROR',
      message:
          'Both the values cannot be same for comparison',
          variant: 'error',
    });
  
    this.dispatchEvent(evt1);
  
 
  }

  showToast1() {

    const evt = new ShowToastEvent({
        
      title: 'ERROR',
      message:
          'Both the values should be selected for comparison',
          variant: 'error',
    });
  
    this.dispatchEvent(evt);
  
 
  }

  /*showToast2() {

    const evt = new ShowToastEvent({
        
      title: 'ERROR',
      message:
          'Both the values should be selected for comparison',
          variant: 'error',
    });
  
    this.dispatchEvent(evt);
  
 
  }*/



  

  exportToCSV() {  
    let columnHeader = ["Name", "Base Price", "Acceptance Date"];  // This array holds the Column headers to be displayd
    let jsonKeys = ["Name", "BasePrice__c","Acceptance_Date__c" ]; // This array holds the keys in the json data  
    
    var jsonRecordsData = this.dataLeft;  
    let csvIterativeData;  
    let csvSeperator  
    let newLineCharacter;  
    csvSeperator = ",";  
    newLineCharacter = "\n";  
    csvIterativeData = "";  
    csvIterativeData += columnHeader.join(csvSeperator);  
    csvIterativeData += newLineCharacter;  
    for (let i = 0; i < jsonRecordsData.length; i++) {  
      let counter = 0;  
      for (let iteratorObj in jsonKeys) {  
        let dataKey = jsonKeys[iteratorObj];  
        if (counter > 0) {  csvIterativeData += csvSeperator;  }  
        if (  jsonRecordsData[i][dataKey] !== null &&  
          jsonRecordsData[i][dataKey] !== undefined  
        ) {  csvIterativeData += '"' + jsonRecordsData[i][dataKey] + '"';  
        } else {  csvIterativeData += '""';  
        }  
        counter++;  
      }  
      csvIterativeData += newLineCharacter;  
    }  
    console.log("csvIterativeData", csvIterativeData);  
    this.hrefdata = "data:text/csv;charset=utf-8," + encodeURI(csvIterativeData);  


    let columnHeader1 = ["Name", "Base Price", "Acceptance Date"];  // This array holds the Column headers to be displayd
    let jsonKeys1 = ["Name", "BasePrice__c","Acceptance_Date__c" ]; // This array holds the keys in the json data  
    
    var jsonRecordsData1 = this.dataRight;  
    let csvIterativeData1;  
    let csvSeperator1  
    let newLineCharacter1;  
    csvSeperator1 = ",";  
    newLineCharacter1 = "\n";  
    csvIterativeData1 = "";  
    csvIterativeData1 += columnHeader1.join(csvSeperator);  
    csvIterativeData1+= newLineCharacter1;  
    for (let i = 0; i < jsonRecordsData1.length; i++) {  
      let counter = 0;  
      for (let iteratorObj1 in jsonKeys1) {  
        let dataKey1 = jsonKeys1[iteratorObj1];  
        if (counter > 0) {  csvIterativeData1 += csvSeperator1;  }  
        if (  jsonRecordsData1[i][dataKey1] !== null &&  
          jsonRecordsData1[i][dataKey1] !== undefined  
        ) {  csvIterativeData1 += '"' + jsonRecordsData1[i][dataKey1] + '"';  
        } else {  csvIterativeData1 += '""';  
        }  
        counter++;  
      }  
      csvIterativeData1 += newLineCharacter1;  
    }  
    console.log("csvIterativeData", csvIterativeData);  
    this.hrefdata = "data:text/csv;charset=utf-8," + encodeURI(csvIterativeData1);  
  
   
  }  
}

  




  /*@wire(getLineItemsToCsv)
  lineItemHandler({data,error}){
      if(data)
      this. lineItemsData=data;

  }
  if(error){
      console.log(error)
  }

  csvGenerator(){
      //headers,totalData,fileTitle
    exportCSVFile(this.columns,this.dataLeft,"LineItem_records")
  }
}*/

