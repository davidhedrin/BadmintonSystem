function openToast(toastId, msgId, msg = 'Hello, world! This is a toast message.', status = 'success'){
  const toastContent = document.getElementById(toastId);
  var toast = new bootstrap.Toast(toastContent);
  toast.show();

  const msgContent = toastContent.querySelector(`#${msgId}`)
  msgContent.innerHTML = msg;

  toastContent.classList.remove('bg-success');
  toastContent.classList.remove('bg-primary');
  toastContent.classList.remove('bg-warning');
  toastContent.classList.remove('bg-danger');

  toastContent.classList.add(`bg-${status}`);
}

function actionLoading(action){
  const loading = document.getElementById('loading_content');
  if(action == 'show') loading.style.display = 'block';
  else if(action == 'hide') loading.style.display = 'none';
  else loading.style.display = 'none';
}