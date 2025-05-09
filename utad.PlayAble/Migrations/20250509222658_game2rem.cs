using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace utad.PlayAble.Migrations
{
    /// <inheritdoc />
    public partial class game2rem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateAdded",
                value: new DateTime(2025, 5, 9, 23, 26, 58, 112, DateTimeKind.Local).AddTicks(8173));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateAdded",
                value: new DateTime(2025, 5, 9, 23, 22, 57, 427, DateTimeKind.Local).AddTicks(7944));

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "Category", "DateAdded", "Description", "FavoriteCount", "ImageUrl", "Instructions", "Name", "PartialViewName" },
                values: new object[] { 2, "Puzzle", new DateTime(2025, 5, 9, 23, 22, 57, 427, DateTimeKind.Local).AddTicks(7968), "Ajude o bebé a chegar ao leite, navegando um labirinto.", 0, "/assets/g/baby.png", "Use as setas do teclado para mover o bebé.|Use espaço para interagir com items no mapa.", "Baby Wants Milk", "e/_baby" });
        }
    }
}
