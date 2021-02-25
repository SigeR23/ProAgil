export interface Lote {
    id: number;
    nome: string;
    preco: number; 
    dataInicial?: Date;
    dataFim?: Date;
    quantidade: number; 
    eventoId: number;
}
