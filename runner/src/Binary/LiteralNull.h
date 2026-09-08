#include "./Instruction.h"

namespace Binary
{
  class LiteralNull : Instruction
  {
  public:
    const static int TypeName = 11;
    LiteralNull(char *binary, int offset);

    const int get_end() const;

  private:
    int end;
  };
}