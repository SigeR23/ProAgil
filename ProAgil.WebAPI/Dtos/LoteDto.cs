using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }

        [Required]
        public string Nome { get; set; }

        [Required]
        public decimal Preco { get; set; }
        public string DataInicial { get; set; }
        public string DataFim { get; set; }
        
        [Range(2, 12000)]
        public int Quantidade { get; set; }

    }
}