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
	alterado timestamp not null
)