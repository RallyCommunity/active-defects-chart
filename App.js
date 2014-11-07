Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    _defects:null,
    launch: function(){
        this._getModel().then({
            success: this._getAllowedValues,
            scope:this
        }).then({
                success:function(results) {
                    _.each(results, function(result){
                         console.log(result);
                    })

                },
                failure:function(error){
                    console.log('oh noes')  ;
                }

            })
    } ,
    _getModel:function(){
          return Rally.data.ModelFactory.getModel({
              type:'Defect'
          })
    } ,

    _getAllowedValues:function(model) {

        var allowedPriorityValues =  this._getAllowedPriorityValues(model);
        var allowedSeverityValues =  this._getAllowedSeverityValues(model);
        var allowedValues = [];
        allowedValues.push(allowedPriorityValues);
        allowedValues.push(allowedSeverityValues)
        return  allowedValues;



    },

    _getAllowedPriorityValues:function(model) {
        var that = this;
        that._model = model;
        var deferred = Ext.create('Deft.Deferred');
        var allowedPriorityValues = [];
        model.getField('Priority').getAllowedValueStore().load({
            callback: function(records,operation,success){
                Ext.Array.each(records,function(allowedValue){
                    allowedPriorityValues.push(allowedValue.get('StringValue'));
                })
               if(success){
                   deferred.resolve(allowedPriorityValues);
               }
                else{
                   deferred.reject()
               }

            }
        })
        return deferred.promise;

    } ,
    _getAllowedSeverityValues:function(model) {
        var deferred = Ext.create('Deft.Deferred');
        var that = this;
        var allowedSeverityValues = []
        model.getField('Severity').getAllowedValueStore().load({
            callback: function(records,operation,success){
                Ext.Array.each(records,function(allowedValue){
                    allowedSeverityValues.push(allowedValue.get('StringValue'));
                })
                if(success){
                    deferred.resolve(allowedSeverityValues);
                }
                else{
                    deferred.reject()
                }
            }

        })
        return deferred.promise;
    }
});
