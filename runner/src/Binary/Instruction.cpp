#include "./Instruction.h"
#include "../Core/List.h"

namespace Binary
{
  struct ParserInfo
  {
    char identifier;
    Instruction *(*init)(char *binary, int offset);
  };

  Core::List<ParserInfo *> parsers = Core::List<ParserInfo *>();

  Instruction *Instruction::Parse(char *binary, int offset)
  {
    for (unsigned int i = 0; i < parsers.get_length(); i++)
    {
      auto item = parsers.get_item(i);

      if (item->identifier = binary[offset])
      {
        return item->init(binary, offset + 1);
      }
    }

    throw "Invalid instruction. Check compiler version vs runner version.";
  }

  void Instruction::Register(char identifier, Instruction *init(char *binary, int offset))
  {
    auto info = new ParserInfo();
    info->identifier = identifier;
    info->init = init;
    parsers.push(info);
  }
}