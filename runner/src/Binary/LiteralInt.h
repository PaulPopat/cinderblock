#include "./Instruction.h"

namespace Binary
{
  class LiteralInt : Instruction
  {
  public:
    const static int TypeName = 9;
    LiteralInt(char *binary, int offset);

    const int get_end() const;

  private:
    int *value;
    int end;
  };
}