define([
    'coreJS/adapt',
    'components/adapt-contrib-mcq/js/adapt-contrib-mcq'
], function(Adapt, Mcq) {

    var Gmcq = Mcq.view.extend({

        events: function() {

            var events = {
                'focus .gmcq-item input': 'onItemFocus',
                'blur .gmcq-item input': 'onItemBlur',
                'change .gmcq-item input': 'onItemSelected',
                'keyup .gmcq-item input':'onKeyPress'
            };

            if ($('html').hasClass('ie8')) {

                var ie8Events = {
                    'click label img': 'forceChangeEvent'
                };

                events = _.extend(events, ie8Events);
            }

            return events;

        },

        onItemSelected: function(event) {

            var selectedItemObject = this.model.get('_items')[$(event.currentTarget).parent('.gmcq-item').index()];

            if (this.model.get('_isEnabled') && !this.model.get('_isSubmitted')) {
                this.toggleItemSelected(selectedItemObject, event);
            }

        },

        setupQuestion: function() {
            Mcq.view.prototype.setupQuestion.call(this);

            this.listenTo(Adapt, 'device:changed', this.resizeImage);
        },

        onQuestionRendered: function() {

            this.resizeImage(Adapt.device.screenSize);

            this.$('label').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));

        },

        resizeImage: function(width) {

            var imageWidth = width === 'medium' ? 'small' : width;

            this.$('label').each(function(index) {
                var src = $(this).find('img').attr('data-' + imageWidth);
                $(this).find('img').attr('src', src);
            });

        },

        // hack for IE8
        forceChangeEvent: function(event) {

            $("#" + $(event.currentTarget).closest("label").attr("for")).change();

        }

    }, {
        template: 'gmcq'
    });

    return Adapt.register("gmcq", {
        view: Gmcq,
        model: Mcq.model
    });

});
