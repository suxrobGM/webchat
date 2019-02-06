using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WebChat.Migrations
{
    public partial class added_group_photo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "MainPhoto",
                table: "Groups",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MainPhoto",
                table: "Groups");
        }
    }
}
