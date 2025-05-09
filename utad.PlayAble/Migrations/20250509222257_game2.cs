using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace utad.PlayAble.Migrations
{
    /// <inheritdoc />
    public partial class game2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "FavoriteCount", "ImageUrl", "Instructions" },
                values: new object[] { new DateTime(2025, 5, 9, 23, 22, 57, 427, DateTimeKind.Local).AddTicks(7944), 0, "/assets/g/tetris.png", "Use as setas do teclado para mover as peças. Use a tecla espaço para acelerar a queda, e a tecla para cima para rodar a peça." });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "Category", "DateAdded", "Description", "FavoriteCount", "ImageUrl", "Instructions", "Name", "PartialViewName" },
                values: new object[] { 2, "Puzzle", new DateTime(2025, 5, 9, 23, 22, 57, 427, DateTimeKind.Local).AddTicks(7968), "Ajude o bebé a chegar ao leite, navegando um labirinto.", 0, "/assets/g/baby.png", "Use as setas do teclado para mover o bebé.|Use espaço para interagir com items no mapa.", "Baby Wants Milk", "e/_baby" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "FavoriteCount", "ImageUrl", "Instructions" },
                values: new object[] { new DateTime(2025, 5, 9, 21, 29, 32, 641, DateTimeKind.Local).AddTicks(6487), 120, "/images/games/tetris.jpg", "Use as setas do teclado para mover as peças. Pressione a tecla para baixo para acelerar a queda. Pressione a tecla de espaço para girar a peça." });
        }
    }
}
