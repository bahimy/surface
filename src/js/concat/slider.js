(function() {
    var View = function(container) {
        var elements = [];
        Array.prototype.forEach.call(container.childNodes, function(currentElement) {
            if (currentElement.nodeType == 1) {
                currentElement.className += ' slider__slide';
                elements.push(currentElement);
            }
        });

        return {
            toggleView: function(slideIndex) {
                container.scrollLeft = container.clientWidth * slideIndex;
            },
            provideElementsCount: function() {
                return elements.length;
            }
        };
    };

    var Radio = function(context) {
        var toggles = document.createElement('div');
        toggles.className = 'slider__toggles';

        var resetTogglesState = function() {
            for (var i = 0; i < context.provideElementsCount(); i++) {
                toggles.childNodes[i].className = 'slider__toggle';
            }
        };

        for (var i = 0; i < context.provideElementsCount(); i++) {
            var toggle = document.createElement('span');
            toggle.index = i;
            toggle.className = 'slider__toggle';
            toggle.addEventListener('click', function(e) {
                resetTogglesState();
                e.target.classList.toggle('slider__toggle--active');
                context.toggleView(e.target.index);
            });
            toggles.appendChild(toggle);
        }
        toggles.childNodes[0].className += ' slider__toggle--active';

        return {
            placeRadio: function(parent) {
                parent.appendChild(toggles);
            }
        };
    };

    var view = new View(document.querySelector('.js-participant__activities'))
    var radio = new Radio(view);
    radio.placeRadio(document.querySelector('.js-participant__athlets'));
})();
