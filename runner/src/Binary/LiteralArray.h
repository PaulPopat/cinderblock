#include "./Instruction.h"
#include <vector>

namespace Binary
{
  class LiteralArray : Instruction
  {
  public:
    const static char TypeName = 4;
    LiteralArray(char *binary, int offset);
    ~LiteralArray();

    const int get_end() const;

  private:
    std::vector<Instruction *> values;
    int end;
  };
}