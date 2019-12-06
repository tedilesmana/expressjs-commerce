$(function(){
	ClassicEditor.create(document.querySelector('#editor')).catch(error=>{
		console.log(error);
	});

	$('a.confirmDeletion').click(function(){
		if(!confirm('Apakah anda yakin ingin menghapus?')){
			return false;
		}
	});
});
