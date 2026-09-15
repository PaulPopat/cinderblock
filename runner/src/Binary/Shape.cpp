#include "Shape.h"

namespace Binary {
struct ParserInfo {
  char identifier;
  std::function<Shape*(const char* binary, int offset)> init;
};

std::vector<ParserInfo*> parsers = std::vector<ParserInfo*>();

Shape* Shape::Parse(const char* binary, int offset)
{
  auto identifier = binary[offset];
  for (const auto& parser : parsers) {
    if (parser->identifier == identifier) {
      return parser->init(binary, offset + 1);
    }
  }

  throw "Invalid shape. Check compiler version vs runner version.";
}

void Shape::Register(char identifier, std::function<Shape*(const char* binary, int offset)> init)
{
  auto info = new ParserInfo();
  info->identifier = identifier;
  info->init = init;
  parsers.push_back(info);
}
}
