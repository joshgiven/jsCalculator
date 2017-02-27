var Calculator = function(){
  var calc = {};

  var calcButtons = [
    {
      name : '1',
      id: 'one',
      class : 'number',
      keyCode : 49,
      dim: [1, 1],
      pos: [3, 0]
    },
    {
      name : '2',
      id: 'two',
      class : 'number',
      keyCode : 50,
      dim: [1, 1],
      pos: [3, 1]
    },
    {
      name : '3',
      id: 'three',
      class : 'number',
      keyCode : 51,
      dim: [1, 1],
      pos: [3, 2]
    },
    {
      name : '4',
      id: 'four',
      class : 'number',
      keyCode : 52,
      dim: [1, 1],
      pos: [2, 0]
    },
    {
      name : '5',
      id: 'five',
      class : 'number',
      keyCode : 53,
      dim: [1, 1],
      pos: [2, 1]
    },
    {
      name : '6',
      id: 'six',
      class : 'number',
      keyCode : 54,
      dim: [1, 1],
      pos: [2, 2]
    },
    {
      name : '7',
      id: 'seven',
      class : 'number',
      keyCode : 55,
      dim: [1, 1],
      pos: [1, 0]
    },
    {
      name : '8',
      id: 'eight',
      class : 'number',
      keyCode : 56,
      dim: [1, 1],
      pos: [1, 1]
    },
    {
      name : '9',
      id: 'nine',
      class : 'number',
      keyCode : 57,
      dim: [1, 1],
      pos: [1, 2]
    },
    {
      name : '0',
      id: 'zero',
      class : 'number',
      keyCode : 48,
      dim: [1, 2],
      pos: [4, 0]
    },

    // operators
    {
      name : '+',
      id: 'plus',
      class : 'operator',
      keyCode : 43,
      dim: [2, 1],
      pos: [1, 3]
    },
    {
      name : '-',
      id: 'minus',
      class : 'operator',
      keyCode : 189,
      dim: [1, 1],
      pos: [0, 3]
    },
    {
      name : '*',
      id: 'multiply',
      class : 'operator',
      keyCode : 42,
      dim: [1, 1],
      pos: [0, 2]
    },
    {
      name : '/',
      id: 'divide',
      class : 'operator',
      keyCode : 191,
      dim: [1, 1],
      pos: [0, 1]
    },

    // others
    {
      name : '=',
      id: 'sum',
      class : 'other',
      keyCode : 187,
      dim: [2, 1],
      pos: [3, 3]
    },
    {
      name : '.',
      id: 'point',
      class : 'other',
      keyCode : 190,
      dim: [1, 1],
      pos: [4, 2]
    },
    {
      name : 'C',
      id: 'clear',
      class : 'other',
      keyCode : 67,
      dim: [1, 1],
      pos: [0, 0]
    },
  ];

  var assignListeners = function($btn, btnDesc){
    var handler;

    if(btnDesc.class === 'number'){
      handler = function(){
        $display = $('#display');
        var d = $display.text();
        $display.text('' + d + btnDesc.name);
      };
    }
    else if(btnDesc.class === 'operator' ) {
      handler = function(){
        $display = $('#display');
        var d = $display.text();

        if(getOpStrings().includes(d.substr(-1))) {
          d = d.slice(0,-1);
        }

        d = (d) ? '' + d + btnDesc.name : '';

        $display.text(d);
      };
    }
    else if(btnDesc.id === 'point') {
      handler = function(){
        $display = $('#display');
        var d = $display.text();

        if(d.substring(-1) !== '.') {
          $display.text('' + d + btnDesc.name);
        }
      };
    }
    else if(btnDesc.id === 'clear'){
      handler = function(){
        $('#display').text('');
      };
    }
    else if(btnDesc.id === 'sum'){
      handler = function(){
        var expr = $('#display').text();

        var newVal = evaluateExpression(expr);
        $('#display').text(newVal);
      };
    }
    else {
      throw 'unimplemented';
    }

    $btn.click(function(e) {
      handler();
    });

    $(document).keydown(function(e) {
      if(e.which !== btnDesc.keyCode) {
        return;
      }

      handler();
    });

    return $btn;
  };

  var opStrings = null;
  var getOpStrings = function() {
    if(!opStrings) {
      opStrings = $('.operator').toArray().map((op) => $(op).text());
    }

    return opStrings;
  };

  allBtnStrings = null;
  var getAllBtnStrings = function() {
    if(!allBtnStrings) {
      allBtnStrings = [];

      calcButtons.forEach(function(b) {
        allBtnStrings.push(b.name);
      });
    }

    return allBtnStrings;
  };

  var evaluateExpression = function(expr) {
    var retVal = '';

    expr.split('').forEach(function(x) {
      if(!getAllBtnStrings().includes(x)) {
        retVal = 'error';
        return;
      }
    });

    return retVal || eval(expr);
  };

  var createView = function() {
    var $table = $('<table>');

    var $display =
      $('<thead>')
        .append($('<tr>'))
          .append( $('<td>').attr('id', 'display').attr('colspan',4) );

    var $tbody = $('<tbody>');

    $table.append($display, $tbody);

    calcButtons.sort(function(a,b) {
      if(a.pos[0] - b.pos[0]) {
        return a.pos[0] - b.pos[0];
      }
      else {
        return a.pos[1] - b.pos[1];
      }
    });

    var $tr;
    calcButtons.forEach(function(b) {
      if(b.pos[1] === 0) {
        $tr = $('<tr>');
        $tbody.append($tr);
      }

      var $td = $('<td>').addClass(b.class)
                         .attr('id', b.id)
                         .attr('rowspan', b.dim[0])
                         .attr('colspan', b.dim[1])
                         .text(b.name);


      assignListeners($td, b);

      $tr.append($td);
    });

    return $('<div>').attr('id', 'calc').append($table);
  };

  style = function() {
    // Calculator
    $('#calc table')
      .css('background', 'rgb(224, 219, 204)')
      .css('width', '200')
      .css('height', '200')
      .css('border-radius', '10px')
      .css('border', 'outset')
      .css('padding', '10px')
      .css('margin', '20px')
      ;

    // Display
    $('#display')
      .css('height', '50px')
      .css('border', 'inset')
      .css('border-radius', '3px')
      .css('background', 'silver')
      .css('color', 'rgb(85, 86, 87)')
      //.css('font-family', "'VT323', monospace")
      .css('font-family', "'TickingTimebombBB', monospace")
      .css('font-size', '40px')
      .css('text-align', 'right')
      .css('vertical-align', 'middle')
      .css('padding', '4px')
      .css('padding-bottom', '0px')
      ;

    // Isert a logo
    var logoText = 'SD-8';
    var $logo = $('<th>').text(logoText).attr('colspan','4');
    $('#calc tbody').before( $('<thead>').append($logo) );
    $logo
      .css('font-family', "'Quattrocento Sans', sans-serif")
      .css('font-style', 'italic')
      .css('font-size', 'large')
      .css('color', 'rgb(200, 140, 24)')
      .css('text-shadow', '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black')
      .css('text-align', 'left')
      .css('padding-left', '10px')
      ;

    // Buttons
    $('#calc tbody td')
      .css('height', '35')
      .css('width', '35')
      .css('border', '1px outset')
      .css('border-radius', '5px')
      .css('text-align', 'center')
      .css('font-family', "'Quattrocento Sans', sans-serif")
      .css('color', 'rgb(85, 85, 85)')
      ;

    // pushy-buttons
    $('#calc tbody td').mousedown(function() {
      $(this).css('border', '1px inset');
    });

    $('#calc tbody td').mouseup(function() {
      $(this).css('border', '1px outset');
    });

    // Specific Buttons
    $('.number, #point')
      .css('background', 'rgb(175, 179, 174)');

    $('.operator')
      .css('background', 'rgb(160, 160, 160)');

    $('#clear')
      .css('background', 'rgb(246, 156, 189)');

    $('#sum')
      .css('background', 'rgb(86, 178, 244)');

  };

  calc.run = function() {
    var $calcView = createView();

    $('body').prepend($calcView);
    style();

    console.log('calc running...');
  };

  return calc;
};


var assignListenersByClass = function(evt,cb,type) {
  $(type).each(function() {
    $(this).on(evt, cb($(this)));
  });
};

var updateDisplay = function($cell) {
  var $display = $('#display');
  var dText = $display.text();
  dText += $cell.text();
  $display.text(dText);
};

// assignListenersByClass('click', updateDisplay, '.number');
