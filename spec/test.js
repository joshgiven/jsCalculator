console.log("LOADED TEST FILE")

describe("Calculator Test Suite", function() {

  describe("1 : Build an HTML table to represent your calculator", function() {

    it("There is a table", function() {
      var numTables = document.getElementsByTagName('table').length;

      expect(numTables).to.equal(1);
    });

    it("There are 10 <td> elements assigned the 'number' class", function() {
      var numNumberClasses = document.getElementsByClassName('number').length;

      expect(numNumberClasses).to.equal(10);
    });

    it("The numbers 0-9 are each in their own <td> with the class 'number'", function() {
      var numberClasses = document.getElementsByClassName('number');
      var nums = [];
      var l = numberClasses.length;

      for (var i = 0 ; i < l ; i++) {
        nums.push(parseInt(numberClasses[i].textContent));
      }

      expect(nums.length).to.equal(10);
      expect(nums.reduce(function(a,b){
        return a+b;
      })).to.equal(45);
    });

    it("There are 4 <td> elements assigned the 'operator' class", function() {
      var numOperators = document.getElementsByClassName('operator').length;

      expect(numOperators).to.equal(4);
    });

    it("The operators are '+', '-', '/', '*'", function() {
      var opClasses = document.getElementsByClassName('operator');
      var ops = [];
      var l = opClasses.length;

      for (var i = 0 ; i < l ; i++) {
        ops.push(opClasses[i].textContent);
      }

      expect(ops.indexOf('+')).to.be.above(-1);
      expect(ops.indexOf('-')).to.be.above(-1);
      expect(ops.indexOf('/')).to.be.above(-1);
      expect(ops.indexOf('*')).to.be.above(-1);

    });

    it("There is a <td> element with the id 'sum'", function() {
      expect(document.getElementById('sum')).to.not.be.null;
    });

    it("There is a <td> element with the id 'clear'", function() {
      expect(document.getElementById('clear')).to.not.be.null;
    });

    it("There is a <td> element with the id 'display'", function() {
      expect(document.getElementById('display')).to.not.be.null;
    });

  });

  describe("2 : Load supporting JS files", function() {

    it("'calc.js' should be sourced from './public/calc.js'", function() {
      var calcScriptLoaded = false;

      var scripts = document.getElementsByTagName('script');
      for (var i = 0 ; i < scripts.length ; i ++) {
        if (scripts[i].outerHTML.includes('./public/calc.js')) {
          calcScriptLoaded = true;
        }
      }
      expect(calcScriptLoaded).to.be.true;
    });

    it("'run.js' should be sourced from './public/run.js'", function() {
      var runScriptLoaded = false;

      var scripts = document.getElementsByTagName('script');
      for (var i = 0 ; i < scripts.length ; i ++) {
        if (scripts[i].outerHTML.includes('./public/calc.js')) {
          runScriptLoaded = true;
        }
      }
      expect(runScriptLoaded).to.be.true;
    });

  });

  describe("3 : Test Dependencies are included", function() {

    it("jQuery is included", function() {
      expect($).to.be.defined;
    });

  });

  describe("4 : Create a application runner callback function", function() {

    it("run.js has $(document).ready");

    it("Create a function called main, assign this as the callback to the $(document).ready", function(){
      expect(typeof main).to.equal('function');
    });

  });

  describe("5 : Create method to dynamically assign event listeners by class", function() {

    it("'assignListenersByClass' function exists", function() {
      expect(assignListenersByClass).to.be.defined;
      expect(typeof assignListenersByClass).to.equal('function');
    });

    beforeEach(function(){
      var div = document.createElement('div');
      div.className += "test";
      div.id = "test-div";
      div.textContent = "apple";
      document.body.appendChild(div);

      var p = document.createElement('p');
      p.className += "test";
      p.id = "test-p";
      p.textContent = "banana";
      document.body.appendChild(p);

      assignListenersByClass('click', function(el){
        $('#test-p').text(el.text());
      }, '.test');

      $('#test-div').click();
    });

    afterEach(function() {
      document.getElementById('test-div').parentElement
        .removeChild(document.getElementById('test-div'));
      document.getElementById('test-p').parentElement
        .removeChild(document.getElementById('test-p'));
    });

    it(`'assignListenersByClass' takes 3 arguments (an event, callback and class
      name). It will assign the provided callback to the corresponding event on
      each element with the provided class. Pass the element to the callback function.`, function() {
        expect(document.getElementById('test-p').textContent).to.equal('apple');
    });
  });

  describe("6 : Create callback function to update display when a number is pressed", function() {
    afterEach(function() {
      document.getElementById('display').textContent = '';
    });

    it(`When a number button is pressed, the display is updated with that number`, function() {
      var nums = document.getElementsByClassName('number');
      var numBtn = nums[0];
      var numVal = nums[0].textContent;
      numBtn.click();

      expect(parseInt(document.getElementById('display').textContent)).not.to.be.NaN;
      expect(document.getElementById('display').textContent).to.equal(numVal);
    });

    it(`When multiple numbers are pressed, the display is updated with all of them`, function() {
      var nums = document.getElementsByClassName('number');
      nums[0].click();
      nums[5].click();
      nums[3].click();

      var numVal = nums[0].textContent + nums[5].textContent + nums[3].textContent;

      expect(parseInt(document.getElementById('display').textContent)).not.to.be.NaN;
      expect(document.getElementById('display').textContent).to.equal(numVal);
    });
  });

  describe("7 : Create a callback function to update the display when an operator is pressed", function() {
    beforeEach(function() {
      document.getElementsByClassName('number')[0].click();
    });

    afterEach(function() {
      document.getElementById('display').textContent = '';
    });
    it(`When an operator is pressed, it is added to the display`, function() {
      var ops = document.getElementsByClassName('operator');
      ops[0].click();

      var display = document.getElementById('display').textContent;
      var re = /[+=\-\/]/;

      expect(re.exec(display)).not.to.be.null;
      expect(re.exec(display).length).to.be.above(0);
    });
  });

  describe("8 : Clear button", function () {
    beforeEach(function() {
      document.getElementById('display').textContent = '7';
    });
    afterEach(function() {
      document.getElementById('display').textContent = '';
    });
    it(`When the clear button is pressed, the display is an empty string`, function() {
      var clear = document.getElementById('clear');
      clear.click();
      var display = document.getElementById('display').textContent;

      expect(display).to.equal('');
    });
  });

  describe("9 : Sum button", function() {
    var addBtn, subtractBtn, multiplyBtn, divideBtn, num1, num2, sumBtn;
    beforeEach(function() {
      sumBtn = document.getElementById('sum');
      var operators = document.getElementsByClassName('operator');

      var l = operators.length;

      for (var i = 0 ; i < l ; i++) {
        switch(operators[i].textContent) {
          case '+' :
            addBtn = operators[i];
            break;
          case '-' :
            subtractBtn = operators[i];
            break;
          case '*' :
            multiplyBtn = operators[i];
            break;
          case '/' :
            divideBtn = operators[i];
            break;
          default :
        }
      }

      num1 = document.getElementsByClassName('number')[0];
      num2 = document.getElementsByClassName('number')[1];
      document.getElementsByClassName('number')[0].click();
      document.getElementsByClassName('number')[1].click();
    });
    afterEach(function() {
      document.getElementById('display').textContent = '';
    });

    it('Can add two values:', function() {
      addBtn.click();
      num1.click();
      sumBtn.click();

      var display = document.getElementById('display').textContent;

      expect(parseInt(display)).to.equal(parseInt(num1.textContent +
        num2.textContent) + parseInt(num1.textContent));
    });

    it('Can subtract two values:', function() {
      subtractBtn.click();
      num1.click();
      sumBtn.click();

      var display = document.getElementById('display').textContent;

      expect(parseInt(display)).to.equal(parseInt(num1.textContent +
        num2.textContent) - parseInt(num1.textContent));
    });

    it('Can divide two values:', function() {
      divideBtn.click();
      num1.click();
      sumBtn.click();

      var display = document.getElementById('display').textContent;

      expect(parseFloat(display)).to.equal(parseFloat(num1.textContent +
        num2.textContent) / parseFloat(num1.textContent));
    });

    it('Can multiply two values:', function() {
      multiplyBtn.click();
      num1.click();
      sumBtn.click();

      var display = document.getElementById('display').textContent;

      expect(parseFloat(display)).to.equal(parseFloat(num1.textContent +
        num2.textContent) * parseFloat(num1.textContent));
    });
  })
});
