/*
Executar na ordem os script abaixo
*/

create table usuario (
	codigo serial primary key,
	nome varchar(100) not null,
	sobrenome varchar(100) not null,
	email varchar(255) not null,
	senha varchar(1000) not null,
	tipo_cadastro int not null,
	documento varchar(15) not null,
	cadastrado timestamp not null,	
	alterado timestamp not null,
	data_nascimento date,
	url_avatar varchar(8000),
	cnh varchar(15),
	celular varchar(12),
	sobre_mim varchar(500)
)