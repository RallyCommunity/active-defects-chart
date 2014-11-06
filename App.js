Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    _defects:null,
    _allowedValues:[],
    launch: function(){
        this._getModel().then({
            success: this._getAllowedPriorityValues,
            scope:this
        }).then ({
            success: this._getAllowedSeverityValues,
            scope:this
        }).then({
                success:function(result) {
                    console.log('results', result);
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
    _getAllowedSeverityValues:function(priorityValues) {
        console.log('priorityValues', priorityValues) ;
        var deferred = Ext.create('Deft.Deferred');
        var that = this;
        var allowedSeverityValues = []
        that._model.getField('Severity').getAllowedValueStore().load({
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
