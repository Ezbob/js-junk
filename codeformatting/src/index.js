Ext.define('blah.blah.extjs.stuff', {
    requires: ['Nothing'],

    items: [
        {
            xtype: 'textfield',
            value: 'type something here'
        },
        {
            xtype: 'button',
            text: 'Hello there'
        }
    ],

    blah: function() {
        console.log('blah');
    }
});
