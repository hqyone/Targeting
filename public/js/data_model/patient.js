/**
 * Created by qhe on 7/13/16.
 */
var Clincal_Dic = Backbone.Model.extend(
    {

    }
)

var Patient  = Backbone.Model.extend({
    url:'/patient',
    inititalize: function(){
        alert('Hey, you create a patient!');
    },

    //The default attributes of patient are defined here
    defaults:{
        AGE:-1,
        AML_IN_SKIN_PERCENTAGE:"",
        BM_BLAST_PERCENTAGE:"",
        CYTOGENETICS:"",
        CYTOGENETIC_CODE_OTHER:"",
        DARK_ZONE_STAT:"",
        DFS_MONTHS:"",
        DFS_STATUS:"",
        FAB:"",
        HISTOLOGICAL_SUBTYPE:"",
        INDUCTION:"",
        INFERRED_GENOMIC_REARRANGEMENT:"",
        OS_MONTHS:"",
        OS_STATUS:"",
        PB_BLAST_PERCENTAGE:"",
        RACE:"",
        RISK_CYTO:"",
        RISK_MOLECULAR:"",
        SEX:"",
        STRUCTURAL_VARIANTS:"",
        SUBCLONES:"",
        TRANSPLANT_TYPE:"",
        WBC:""
    },
    validate:function(attributes){
        if(attributes.AGE <-1){
            return "Age can't be negative";
        }
    },
    aboutMe: function(){
        return "PatientInformation"
    }
})