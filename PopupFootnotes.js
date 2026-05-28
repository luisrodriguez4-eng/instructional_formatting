// This script requires jQuery and works perfectly inside an LMS like Brightspace
$(document).ready(function() {
    Footnotes.setup();
});

var Footnotes = {
    footnotetimeout: false,
    
    setup: function() {
        // Targets all your physics lab custom footnote links (.gfn, .bfn, .yfn)
        var footnotelinks = $("a.gfn, a.bfn, a.yfn");
        footnotelinks.unbind('mouseover', Footnotes.footnoteover);
        footnotelinks.unbind('mouseout', Footnotes.footnoteoout);
        footnotelinks.bind('mouseover', Footnotes.footnoteover);
        footnotelinks.bind('mouseout', Footnotes.footnoteoout);
        
        // Dynamically add numbering [1], [2], etc., if the anchor tag text is left empty
        footnotelinks.each(function(index) {
            if ($(this).text().trim() === '') {
                $(this).text('[' + (index + 1) + ']');
            }
        });
    },
    
    footnoteover: function() {
        clearTimeout(Footnotes.footnotetimeout);
        $('#footnotediv').stop().remove();
        
        // Extract the targeted footnote block ID from an HTML attribute (using data-target)
        var id = $(this).attr('data-target');
        var targetElement = document.getElementById(id);
        if (!targetElement) return; // Exit if the footnote text block doesn't exist
        
        var position = $(this).offset();
        var div = $(document.createElement('div'));
        div.attr('id', 'footnotediv');
        div.bind('mouseover', Footnotes.divover);
        div.bind('mouseout', Footnotes.footnoteoout);
        
        // Dynamically grab the exact background color style from your CSS stylesheet rules
        var matchingBg = $(targetElement).css('background-color') || '#F5F6F7';
        
        div.html($(targetElement).html());
        div.find("a[rev='footnote']").remove();
        
        // Dynamic positioning setup
        div.css({
            position: 'absolute',
            width: '22em',
            background: matchingBg, // Pulls color right from your .blongfootnote or .ylongfootnote rules!
            padding: '10px 15px',
            border: '1px solid #212738',
            'font-size': '95%',
            'font-family': 'Verdana, sans-serif',
            'line-height': 1.4,
            'border-radius': '.5em',
            'box-shadow': '2px 2px 8px rgba(0,0,0,0.15)',
            'z-index': 99999, // Guarantees it sits above Brightspace framework panes
            opacity: 0.98,
            'text-align': 'left'
        });
        
        $(document.body).append(div);
        
        var left = position.left;
        if (left + 420 > $(window).width() + $(window).scrollLeft()) {
            left = $(window).width() - 420 + $(window).scrollLeft();
        }
        var top = position.top + 20;
        if (top + div.height() > $(window).height() + $(window).scrollTop()) {
            top = position.top - div.height() - 15;
        }
        
        div.css({ left: left, top: top });
    },
    
    footnoteoout: function() {
        Footnotes.footnotetimeout = setTimeout(function() {
            $('#footnotediv').animate({ opacity: 0 }, 400, function() {
                $(this).remove();
            });
        }, 150);
    },
    
    divover: function() {
        clearTimeout(Footnotes.footnotetimeout);
        $('#footnotediv').stop().css({ opacity: 0.98 });
    }
};
