#include "./Instruction.h"

namespace Binary
{
  class LiteralInt : Instruction
  {
  public:
    const static char TypeName = 9;
    LiteralInt(char *binary, int offset);
    ~LiteralInt();

    const int get_end() const;

  private:
    int *value;
    int end;
  };
}