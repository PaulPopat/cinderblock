#include "Shape.h"

namespace Binary {
struct ShapeParserInfo {
  char identifier;
  std::function<Shape*(const char* binary, int offset)> init;
};

std::vector<ShapeParserInfo*> shape_parsers = std::vector<ShapeParserInfo*>();

Shape* Shape::Parse(const char* binary, int offset)
{
  auto identifier = binary[offset];
  for (const auto& parser : shape_parsers) {
    if (parser->identifier == identifier) {
      return parser->init(binary, offset + 1);
    }
  }

  throw "Invalid shape. Check compiler version vs runner version.";
}

void Shape::Register(char identifier, std::function<Shape*(const char* binary, int offset)> init)
{
  auto info = new ShapeParserInfo();
  info->identifier = identifier;
  info->init = init;
  shape_parsers.push_back(info);
}
}
