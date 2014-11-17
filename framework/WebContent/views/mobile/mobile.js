Ext.application({
    name: 'mobile',
    appFolder : 'views/mobile',
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    glossOnIcon: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@114.png'
    },

    models: ['OrderForm'],
    stores: ['OrderForms'],
    views: ['Main'],
    controllers: ['Order'],

    launch: function() {
        Ext.Viewport.add({
            xclass: 'mobile.view.Main'
        });
    }
});
