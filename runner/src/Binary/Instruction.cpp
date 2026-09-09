#include "./Instruction.h"
#include <vector>

namespace Binary
{
  struct ParserInfo
  {
    char identifier;
    Instruction *(*init)(char *binary, int offset);
  };

  std::vector<ParserInfo *> parsers = std::vector<ParserInfo *>();

  Instruction *Instruction::Parse(char *binary, int offset)
  {
    for (const auto &parser : parsers)
    {
      if (parser->identifier = binary[offset])
      {
        return parser->init(binary, offset + 1);
      }
    }

    throw "Invalid instruction. Check compiler version vs runner version.";
  }

  void Instruction::Register(char identifier, Instruction *init(char *binary, int offset))
  {
    auto info = new ParserInfo();
    info->identifier = identifier;
    info->init = init;
    parsers.push_back(info);
  }
}