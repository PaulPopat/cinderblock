#include "./Instruction.h"
#include "../Core/List.h"

namespace Binary
{
  class LiteralArray : Instruction
  {
  public:
    const static int TypeName = 4;
    LiteralArray(char *binary, int offset);

    const int get_end() const;

  private:
    Core::List<Instruction *> values;
    int end;
  };
}