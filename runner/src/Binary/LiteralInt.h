#include "./Instruction.h"

namespace Binary
{
  class LiteralInt : Instruction
  {
  public:
    LiteralInt(char *binary, int offset);

    const int get_end() const;

  private:
    int* value;
    int end;
  };
}