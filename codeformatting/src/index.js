Ext.define('blah.blah.extjs.stuff', {
    requires: ['Nothing'],

    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    xtype: 'textfield',
                    value: 'type something here'
                },
                {
                    xtype: 'button',
                    text: 'Hello there'
                }
            ]
        });

        me.callParent();
    },

    blah: function() {
        console.log('blah');
    }
});
