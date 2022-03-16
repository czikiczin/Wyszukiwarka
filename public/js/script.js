function removeEmpties() {
  var form = document.getElementById('theform');
  var inputs = form.children;
  var remove = [];
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value == '') {
      remove.push(inputs[i]);
    }
  }

  if (remove.length == inputs.length - 1) return false;

  for (var i = 0; i < remove.length; i++) form.removeChild(remove[i]);
  return true;
}
